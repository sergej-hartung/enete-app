<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tariff_id');
            $table->unsignedBigInteger('status_id')->nullable();
            $table->string('commission_name', 255)->nullable();
            $table->unsignedBigInteger('export_target_id')->nullable();
            $table->float('commission_fixed_eur_in')->nullable();
            $table->float('commission_fixed_ontop')->nullable();
            $table->boolean('check_ontop')->nullable();
            $table->float('fixed_complete_commission_in')->nullable();
            $table->float('margin_fixed_eur')->nullable();
            $table->float('commission_based_eur_in')->nullable();
            $table->unsignedBigInteger('commission_based_kwh_in')->nullable();
            $table->float('margin_based_eur')->nullable();
            $table->unsignedBigInteger('margin_based_kwh')->nullable();
            $table->boolean('custom_commission_fixed_out')->nullable();
            $table->float('commission_fixed_out')->nullable();
            $table->float('consumption_of_kwh')->nullable();
            $table->float('consumption_up_to_kwh')->nullable();
            $table->boolean('has_hardware')->default(false);
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_to')->nullable();
            $table->unsignedBigInteger('commission_type_id')->nullable();
            $table->unsignedBigInteger('interval_id')->nullable();
            $table->unsignedBigInteger('rounding_rules_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('tariff_id')->references('id')->on('tariffs');
            $table->foreign('status_id')->references('id')->on('commission_statuses');
        });
    }

    public function down()
    {
        Schema::dropIfExists('commissions');
    }
};
