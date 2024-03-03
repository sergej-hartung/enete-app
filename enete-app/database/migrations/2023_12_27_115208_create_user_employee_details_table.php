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
        Schema::create('user_employee_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_profile_id');
            $table->string('vp_nr')->nullable();
            $table->string('egon_nr')->unique()->nullable();
            $table->string('company')->nullable();

            $table->string('marital_status')->nullable();           
  

            $table->boolean('id_card')->nullable();
            $table->boolean('business_registration')->nullable();
            $table->boolean('sales_tax_liability')->nullable();
            $table->boolean('vat_liability_proven')->nullable();
            $table->string('tax_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('tax_office')->nullable();
            $table->string('datev_no')->nullable();
            $table->date('entrance')->nullable();
            $table->date('entry')->nullable();
            $table->date('exit')->nullable();
            $table->boolean('billing_blocked')->nullable();
            $table->boolean('payout_blocked')->nullable();

            $table->unsignedBigInteger('status_id')->references('id')->on('user_employee_details_statuses')->onDelete('set null');
            $table->unsignedBigInteger('career_id')->references('id')->on('user_employee_details_careers')->onDelete('set null');
            $table->unsignedBigInteger('categorie_id')->references('id')->on('user_employee_details_categories')->onDelete('set null'); //user_employee_details_categorie_id
          
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('user_profile_id')->references('id')->on('user_profiles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_employee_details');
    }
};
