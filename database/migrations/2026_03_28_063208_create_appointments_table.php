<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_no')->unique();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('dentist_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users');
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('treatment_type');
            $table->text('chief_complaint')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', [
                'pending',
                'confirmed',
                'waiting',
                'in_progress',
                'completed',
                'cancelled',
                'no_show'
            ])->default('pending');
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};