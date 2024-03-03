<?php

namespace App\Http\Controllers\User\Profile\Admin;


use App\Models\User\UserProfile;
use App\Http\Controllers\Controller;
use App\Http\Filters\UserProfileFilter;
use App\Http\Resources\User\Profile\IndexProfileResource;
use App\Http\Requests\User\Profile\IndexProfileRequest;

class IndexController extends Controller
{
    public function __invoke(IndexProfileRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(UserProfileFilter::class, ['queryParams' => array_filter($data)]);
        //$test = UserProfile::with('employee.status')->find(2);
        //dd($test->employee);
        // Добавьте логику для проверки параметра `is_admin`
        if (isset($data['is_admin'])) {
            if ($data['is_admin']) {

                //dd($data['is_admin']);
                // Применяем фильтр только для администраторов
                $profile = UserProfile::with(['users', 'employee.status'])->whereHas('users', function ($query) {
                    $query->where('role_id', '=', '1');
                })->filter($filter)->sort($data)->get();
            } else {
                // Применяем фильтр исключая администраторов
                $profile = UserProfile::with(['users', 'employee.status'])->whereDoesntHave('users', function ($query) {
                    $query->where('role_id', '=', '1');
                })->filter($filter)->sort($data)->get();
                //dd($profile);
            }
        } else {
            // Поведение по умолчанию (возвращаем все профили без фильтрации по статусу администратора)
            $profile = UserProfile::with(['users', 'employee.status'])->filter($filter)->sort($data)->get();
            //dd($profile->users);
        }

        //$profile = UserProfile::with(['users', 'status'])->filter($filter)->sort($data)->get();

        return IndexProfileResource::collection($profile);
    }
}

