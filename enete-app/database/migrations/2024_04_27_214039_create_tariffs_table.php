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
        Schema::create('tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('external_id', 255)->nullable();
            $table->unsignedBigInteger('api_distributor_id')->nullable();
            $table->string('name', 255)->nullable();
            $table->string('name_short', 255)->nullable();
            $table->unsignedBigInteger('provider_id')->nullable();
            $table->unsignedBigInteger('network_operator_id')->nullable();
            $table->unsignedBigInteger('group_id')->nullable();
            $table->unsignedBigInteger('template_id')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();
            $table->boolean('has_action')->nullable();
            $table->unsignedBigInteger('action_group_id')->nullable();
            $table->boolean('is_published')->nullable();
            $table->text('note')->nullable();
            $table->unsignedBigInteger('file_id')->nullable();
            $table->boolean('is_from_api')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        
            $table->foreign('provider_id')->references('id')->on('tariff_providers')->onDelete('cascade');
            $table->foreign('network_operator_id')->references('id')->on('tariff_network_operators')->onDelete('cascade');
            $table->foreign('group_id')->references('id')->on('tariff_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariffs');
    }
};
