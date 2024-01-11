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
        Schema::create('tariff_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('kennung');
            $table->string('name');
            $table->foreignId('attribute_type_id')->constrained('tariff_attribute_types');
            $table->string('einheit');
            $table->tinyInteger('system_field');
            $table->tinyInteger('required');
            $table->tinyInteger('frontend_visible');
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
        // if(Schema::hasTable('tariff_attribute_group_tariff')){
        //     Schema::table('tariff_attribute_group_tariff', function(Blueprint $table){
        //         $table->dropForeign('tariff_attribute_group_tariff_attribute_id_foreign');
        //         if(Schema::hasColumn('tariff_attribute_group_tariff','attribute_id')){
        //             $table->dropColumn('attribute_id');
        //         }
        //     });
        // }
        Schema::dropIfExists('tariff_attributes');
    }
};
