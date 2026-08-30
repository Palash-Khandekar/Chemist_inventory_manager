package com.example.chemist_inventory.dao;

import com.example.chemist_inventory.entity.medicine;
import com.example.chemist_inventory.repositry.medicineRepo;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class Medicinedao {

    @Autowired
    private medicineRepo medicineRepository;

    public medicine createMedicine(medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public List<medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    public Optional<medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }
    public medicine createmedicine(medicine medicine) {
    medicine.setUpdatedAt(LocalDateTime.now());
    return medicineRepository.save(medicine);
    }
    public boolean deleteById(Long id){
        Optional<medicine> recmedicine = getMedicineById(id);
        if(recmedicine.isPresent()){
            medicineRepository.delete(recmedicine.get());
            return true;
        }
        return false;
    }
   public List<medicine> searchMedicine(String name) {
    return medicineRepository.findByNameContainingIgnoreCase(name);
    }

}
