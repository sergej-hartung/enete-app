<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('commission_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_name', 255)->nullable();
            $table->string('icon', 255)->nullable();
            $table->float('default_difference')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('commission_groups');
    }
};