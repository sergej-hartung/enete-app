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
        Schema::create('user_profile_contacts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_profile_id');
            $table->unsignedBigInteger('user_profile_contact_category_id')->nullable();
            $table->unsignedBigInteger('user_profile_contact_type_id')->nullable();
            $table->string('prefix')->nullable();
            $table->string('number')->nullable();
            $table->foreign('user_profile_id')->references('id')->on('user_profiles')->onDelete('cascade');
            $table->foreign('user_profile_contact_category_id')->references('id')->on('user_profile_contact_categories');
            $table->foreign('user_profile_contact_type_id')->references('id')->on('user_profile_contact_types');
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
        Schema::dropIfExists('user_profile_contacts');
    }
};
