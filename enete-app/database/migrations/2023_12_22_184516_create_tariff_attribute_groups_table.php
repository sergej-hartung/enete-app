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
        Schema::create('tariff_attribute_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tariff_id');
            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('cascade');
            $table->string('name');
            $table->integer('position')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
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
        //         $table->dropForeign('tariff_attribute_group_tariff_attribute_group_id_foreign');
        //         $table->dropColumn('attribute_group_id');
        //     });
        // }
        
        Schema::dropIfExists('tariff_attribute_groups');
    }
};
