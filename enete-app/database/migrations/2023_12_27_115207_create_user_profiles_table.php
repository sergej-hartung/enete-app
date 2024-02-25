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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            
            $table->string('vp_nr')->nullable();
            $table->string('egon_nr')->unique()->nullable();
            $table->string('company')->nullable();
            $table->string('salutation');
            $table->string('title')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('marital_status')->nullable();           
            $table->date('birthdate')->nullable();
            $table->string('email');
            $table->timestamp('email_sent')->nullable();
            $table->string('email_verification_hash')->nullable();
            $table->timestamp('email_verified_at')->nullable();
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
            $table->text('internal_note')->nullable();
            $table->text('external_note')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->unsignedBigInteger('career_id')->nullable();
            $table->unsignedBigInteger('user_profile_categorie_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();            
            $table->timestamp('last_visit')->nullable();            
            $table->foreign('parent_id')->references('id')->on('user_profiles')->onDelete('set null');
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
        Schema::dropIfExists('user_profiles');
    }
};
