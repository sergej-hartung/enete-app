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
        Schema::create('group_hardware_mappings', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger('group_id')->nullable();
            // $table->unsignedBigInteger('hardware_group_id')->nullable();
            // $table->unsignedBigInteger('created_by')->nullable();
            // $table->unsignedBigInteger('updated_by')->nullable();
            // $table->timestamps();

            // // Setting foreign key relations
            // $table->foreign('group_id')->references('id')->on('groups')->onDelete('set null');
            // $table->foreign('hardware_group_id')->references('id')->on('hardware_groups')->onDelete('set null');  // Make sure the hardware_groups table exists.

            // // Adding indexes for better query performance
            // $table->index('group_id');
            // $table->index('hardware_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_hardware_mappings');
    }
};
