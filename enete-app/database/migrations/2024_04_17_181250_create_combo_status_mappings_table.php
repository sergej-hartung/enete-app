<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('combo_status_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('combo_status_id')->nullable();
            $table->unsignedBigInteger('tariff_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('combo_status_id')->references('id')->on('combo_statuses');
            $table->foreign('tariff_id')->references('id')->on('tariffs');
        });
    }

    public function down()
    {
        Schema::dropIfExists('combo_status_mappings');
    }
};
