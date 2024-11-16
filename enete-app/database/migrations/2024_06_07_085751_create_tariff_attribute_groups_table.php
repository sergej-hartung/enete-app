<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tariff_attribute_groups', function (Blueprint $table) {
            $table->id();     
            $table->unsignedBigInteger('tariff_id')->nullable();     
            $table->string('name', 255)->nullable();
            $table->string('uniqueId', 255)->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->unsignedBigInteger('updated_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_attribute_groups');
    }
};
