package com.example.chemist_inventory.exception;

import com.example.chemist_inventory.entity.ResponseStructure;
import com.example.chemist_inventory.entity.medicine;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class medicineExceptionHandler {

    @ExceptionHandler(medicineException.class)
    public ResponseEntity<ResponseStructure<medicine>> handleMedicineException(medicineException e) {
        ResponseStructure<medicine> response = new ResponseStructure<>(e.getMessage(), HttpStatus.NOT_FOUND.value(), null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
