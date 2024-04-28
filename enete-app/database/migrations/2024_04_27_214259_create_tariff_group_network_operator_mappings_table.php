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
        Schema::create('tariff_group_network_operator_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id')->nullable();
            $table->unsignedBigInteger('network_operator_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        
            // Shortened constraint names
            $table->foreign('group_id', 'group_id_fk')
                  ->references('id')->on('tariff_groups')
                  ->onDelete('cascade');
            $table->foreign('network_operator_id', 'network_operator_id_fk')
                  ->references('id')->on('tariff_network_operators')
                  ->onDelete('cascade');

            // Indexes
            $table->index('group_id');
            $table->index('network_operator_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_group_network_operator_mappings');
    }
};
