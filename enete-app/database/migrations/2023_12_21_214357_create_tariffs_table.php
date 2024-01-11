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
            $table->integer('extern_id');
            $table->foreignId('api_distributor_id')->constrained('api_distributors');
            $table->foreignId('tariff_type_id')->constrained('tariff_types');
            $table->foreignId('tariff_category_id')->constrained('tariff_categories');
            $table->string('name');
            $table->string('name_small');
            $table->foreignId('provider_id')->constrained('tariff_providers');
            $table->foreignId('network_operator_id')->constrained('tariff_network_operators');
            $table->foreignId('tariff_group_id')->constrained('tariff_groups');
            $table->foreignId('tariff_status_id')->constrained('tariff_statuses');
            $table->float('commission');
            $table->float('on_top');
            $table->float('max_commission');
            $table->float('margin');
            $table->tinyInteger('is_published');
            $table->text('notiz');
            $table->string('pdf_document');
            $table->tinyInteger('from_api');
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
