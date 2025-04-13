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
        Schema::create('tariff_group_sorting_criterias_mapp', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id')->nullable();
            $table->unsignedBigInteger('sorting_criterias_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        

            $table->foreign('group_id')
                  ->references('id')
                  ->on('tariff_groups') 
                  ->onDelete('cascade');

            $table->foreign('sorting_criterias_id')
                  ->references('id')
                  ->on('tariff_sorting_criterias') 
                  ->onDelete('cascade');

            // Indexes
            $table->index('group_id');
            $table->index('sorting_criterias_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_group_sorting_criterias_mapp');
    }
};
