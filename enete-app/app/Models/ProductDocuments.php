<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDocuments extends Model
{
    use HasFactory;

    protected $fillable = ['original_name', 'path', 'mime_type', 'size'];
}
