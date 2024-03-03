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
            
            $table->string('salutation');
            $table->string('title')->nullable();
            $table->string('first_name');
            $table->string('last_name');
     
            $table->date('birthdate')->nullable();
            $table->string('email');
            $table->timestamp('email_sent')->nullable();
            $table->string('email_verification_hash')->nullable();
            $table->timestamp('email_verified_at')->nullable();

            $table->text('internal_note')->nullable();
            $table->text('external_note')->nullable();

            $table->unsignedBigInteger('parent_id')->nullable();            
            // $table->timestamp('last_visit')->nullable();            
            $table->foreign('parent_id')->references('id')->on('user_profiles')->onDelete('set null');
            $table->enum('user_type',['is_admin', 'is_employee', 'is_customer'])->default('is_customer');
            // $table->boolean('is_admin')->default(false);
            // $table->boolean('is_employee')->default(false);
            // $table->boolean('is_customer')->default(false);
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
