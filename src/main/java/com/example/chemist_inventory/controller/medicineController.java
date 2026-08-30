package com.example.chemist_inventory.controller;

import com.example.chemist_inventory.entity.AdminLogin;
import com.example.chemist_inventory.entity.ResponseStructure;
import com.example.chemist_inventory.entity.medicine;
import com.example.chemist_inventory.service.MedicineService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class medicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping("/medicines")
    public ResponseEntity<ResponseStructure<medicine>> createMedicine(@RequestBody medicine medicine) {
        return medicineService.createMedicine(medicine);
    }
    @GetMapping("/getAllMedicines")
    public ResponseEntity<ResponseStructure<medicine>> getAllMedicines() {
        return medicineService.getAllMedicines();
    }
    @GetMapping("/getMedicine/{id}")
    public ResponseEntity<ResponseStructure<Optional<medicine>>> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }
    @PutMapping("/updateMedicine/{id}")
    public ResponseEntity<ResponseStructure<medicine>> updateMedicineById(@RequestBody medicine medicine , @PathVariable Long id) {
        return medicineService.updateMedicineById(medicine, id);
    }
    @DeleteMapping("/deleteMedicine/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteById(@PathVariable Long id){
        return medicineService.deleteById(id);
    }
    @GetMapping("/search")
    public ResponseEntity<ResponseStructure<List<medicine>>> searchMedicine(@RequestParam String name) {

        return medicineService.searchMedicine(name);
    }
    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestBody AdminLogin login) {

    if (login.getUsername().equals("admin")
            && login.getPassword().equals("admin123")) {

        return ResponseEntity.ok("Login successful");
    }

    return ResponseEntity.status(401).body("Invalid username or password");
    }
}

