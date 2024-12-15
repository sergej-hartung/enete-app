<?php

namespace App\Http\Controllers\ProductDocument;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\ProductDocuments;
use App\Models\Tariff\Tariff;

class ProductDocumentController extends Controller
{
    public function createFolder(Request $request)
    {
        $path = $request->input('path', '');
        $folderName = $request->input('folder_name');
        $fullPath = 'products/' . $path . '/' . $folderName;
        Storage::makeDirectory($fullPath);
        return response()->json(['message' => 'Folder created successfully.']);
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:jpeg,jpg,png,gif,pdf,svg'
        ]);

        $file = $request->file('file');
        $path = 'products/' . trim($request->input('path', ''), '/');
        $storedPath = $file->storeAs($path, $file->getClientOriginalName());

        // Создаем запись о файле в БД
        ProductDocuments::create([
            'original_name' => $file->getClientOriginalName(),
            'path' => $storedPath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize()
        ]);

        return response()->json(['message' => 'File uploaded successfully.']);
    }

    public function getTree()
    {
        $tree = $this->buildTree('products');
        return response()->json($tree);
    }

    public function getFiles(Request $request)
    {
        $folder = $request->query('folder');
        $search = $request->query('search', ''); // По умолчанию пустая строка
        $mimeType = $request->query('mime_type', ''); // По умолчанию пустая строка
        $fullPath = 'products/' . trim($folder, '/');
        $files = Storage::files($fullPath);
        $fileInfo = [];

        foreach ($files as $file) {
            $relativePath = Str::after($file, 'products/');
            $fileRecord = ProductDocuments::where('path', $file)->first();

            if ($fileRecord) {
                $fileName = Str::afterLast($relativePath, '/');

                // Фильтрация по вхождению строки поиска в имя файла
                if (($search === '' || stripos($fileName, $search) !== false) &&
                    ($mimeType === '' || $fileRecord->mime_type === $mimeType)){
                    $fileInfo[] = [
                        'id' => $fileRecord->id,
                        'name' => $fileName,
                        'path' => $relativePath,
                        'type' => 'file',
                        'mime_type' => $fileRecord->mime_type,
                        'size' => $fileRecord->size,
                    ];
                }
            }
        }

        return response()->json($fileInfo);
    }

    public function getFileContent(Request $request)
    {
        $path = $request->query('path');
        $fullPath = 'products/' . trim($path, '/');
        $content = Storage::get($fullPath);
        return response($content, 200)->header('Content-Type', Storage::mimeType($fullPath));
    }

    public function getFileContentById($id)
    {
        $file = ProductDocuments::find($id);

        if ($file) {
            if (Storage::exists($file->path)) {
                $content = Storage::get($file->path);
                return response($content, 200)
                    ->header('Content-Type', $file->mime_type);
            }
            return response()->json(['message' => 'File not found in storage.'], 404);
        }

        return response()->json(['message' => 'File not found in database.'], 404);
    }

    public function deleteFolder(Request $request)
    {
        $path = 'products/' . trim($request->input('path'), '/');
        $fullPath = $path;

        if (Storage::exists($fullPath)) {
            $files = ProductDocuments::where('path', 'LIKE', $fullPath . '%')->get();

            foreach ($files as $file) {
                if ($this->isFileLinked($file)) {
                    return response()->json(['message' => 'One or more files in the folder are linked to a tariff or hardware and cannot be deleted.'], 403);
                }
                Storage::delete($file->path);
                $file->delete();
            }

            $this->deleteDirectory($fullPath);
            return response()->json(['message' => 'Folder deleted successfully.']);
        }

        return response()->json(['message' => 'Folder not found.'], 404);
    }

    public function deleteFile(Request $request)
    {
        $path = 'products/' . trim($request->input('path'), '/');
        $file = ProductDocuments::where('path', $path)->first();

        if ($file) {
            // Проверка на связи с тарифом или hardware
            if ($this->isFileLinked($file)) {
                return response()->json(['message' => 'File is linked to a tariff or hardware and cannot be deleted.'], 403);
            }

            Storage::delete($file->path);
            $file->delete();

            return response()->json(['message' => 'File deleted successfully.']);
        }

        return response()->json(['message' => 'File not found.'], 404);
    }


    public function renameFolder(Request $request)
    {
        $oldPath = 'products/' . trim($request->input('old_path'), '/');
        $newPath = 'products/' . trim($request->input('new_path'), '/');

        if (Storage::exists($oldPath)) {
            // Проверка наличия папки с новым именем
            $parentPath = dirname($oldPath);
            $newFolderName = basename($newPath);
            $newFullPath = $parentPath . '/' . $newFolderName;

            if (Storage::exists($newFullPath)) {
                return response()->json(['message' => 'Папка с таким именем уже существует.'], 409);
            }

            // Переименование папки на диске
            Storage::move($oldPath, $newPath);

            // Обновление записей в БД
            $files = ProductDocuments::where('path', 'LIKE', $oldPath . '%')->get();
            foreach ($files as $file) {
                $file->path = str_replace($oldPath, $newPath, $file->path);
                $file->save();
            }

            return response()->json(['message' => 'Папка успешно переименована.']);
        }

        return response()->json(['message' => 'Папка не найдена.'], 404);
    }

    public function renameFile(Request $request)
    {
        $oldPath = 'products/' . trim($request->input('old_path'), '/');
        $newPath = 'products/' . trim($request->input('new_path'), '/');

        if (Storage::exists($oldPath)) {
            // Переименование файла на диске
            Storage::move($oldPath, $newPath);

            // Обновление записи в БД
            $file = ProductDocuments::where('path', $oldPath)->first();
            if ($file) {
                $file->path = $newPath;
                $file->original_name = basename($newPath);
                $file->save();
            }

            return response()->json(['message' => 'File renamed successfully.']);
        }

        return response()->json(['message' => 'File not found.'], 404);
    }

    private function deleteDirectory($dir)
    {
        $files = Storage::allFiles($dir);
        $directories = Storage::allDirectories($dir);

        foreach ($files as $file) {
            Storage::delete($file);
        }

        foreach ($directories as $subDir) {
            $this->deleteDirectory($subDir);
        }

        Storage::deleteDirectory($dir);
    }

    private function isFileLinked($file)
    {
        // Логика для проверки связи с тарифами или hardware
        // Например:
        return Tariff::where('file_id', $file->id)->exists(); //|| Hardware::where('file_id', $file->id)->exists();
        //return false; // Реализуйте эту функцию по мере необходимости
    }

    private function buildTree($dir)
    {
        $directories = Storage::allDirectories($dir);
        $files = Storage::allFiles($dir);
        sort($directories);
        sort($files); 

        $result = [];

        foreach ($directories as $directory) {
            $relativePath = Str::after($directory, $dir . '/');
            $this->addDirectory($result, explode('/', $relativePath));
        }

        foreach ($files as $file) {
            $relativePath = Str::after($file, $dir . '/');
            $absolutePath = $file; // Используем абсолютный путь
            $this->addFile($result, explode('/', $relativePath), $relativePath, $absolutePath);
        }

        return $result;
    }

    private function addDirectory(&$tree, $parts)
    {
        $current = &$tree;

        foreach ($parts as $index => $part) {
            $found = false;

            foreach ($current as &$item) {
                if ($item['type'] === 'folder' && $item['name'] === $part) {
                    $current = &$item['children'];
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $path = implode('/', array_slice($parts, 0, $index + 1));
                $newDir = [
                    'name' => $part,
                    'path' => $path,
                    'type' => 'folder',
                    'children' => []
                ];
                $current[] = $newDir;

                usort($current, fn($a, $b) => $a['name'] <=> $b['name']);

                $current = &$newDir['children'];
            }
        }
    }

    private function addFile(&$tree, $parts, $relativePath, $absolutePath)
    {
        $current = &$tree;
        $fileRecord = ProductDocuments::where('path', $absolutePath)->first();

        foreach ($parts as $index => $part) {

            if ($index === count($parts) - 1 && $fileRecord) {
                // Добавляем файл, если это последний элемент в пути и запись найдена
                $current[] = [
                    'id' => $fileRecord->id,
                    'name' => $part,
                    'path' => $relativePath,
                    'type' => 'file',
                    'mime_type' => $fileRecord->mime_type,  // Добавлено
                    'size' => $fileRecord->size  // Добавлено
                ];
            } else {
                // Продолжаем искать папку
                $found = false;

                foreach ($current as &$item) {
                    if ($item['type'] === 'folder' && $item['name'] === $part) {
                        $current = &$item['children'];
                        $found = true;
                        break;
                    }
                }

                if (!$found) {
                    // Создаем папку, если она не найдена
                    $newDir = [
                        'name' => $part,
                        'path' => implode('/', array_slice($parts, 0, $index + 1)),
                        'type' => 'folder',
                        'children' => []
                    ];
                    $current[] = $newDir;

                    usort($current, fn($a, $b) => $a['name'] <=> $b['name']);

                    $current = &$newDir['children'];
                }
            }
        }
    }
}