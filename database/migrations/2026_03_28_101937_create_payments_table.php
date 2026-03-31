<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_no')->unique();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->onDelete('set null');
            $table->foreignId('created_by')->constrained('users');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', [
                'cash',
                'gcash',
                'maya',
                'bank_transfer',
                'credit_card',
            ])->default('cash');
            $table->enum('status', [
                'paid',
                'unpaid',
                'partial',
            ])->default('unpaid');
            $table->text('notes')->nullable();
            $table->date('payment_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};