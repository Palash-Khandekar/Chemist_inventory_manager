package com.example.chemist_inventory.service;

import com.example.chemist_inventory.dao.Medicinedao;
import com.example.chemist_inventory.entity.ResponseStructure;
import com.example.chemist_inventory.entity.medicine;
import com.example.chemist_inventory.exception.medicineException;
import com.example.chemist_inventory.repositry.medicineRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class MedicineService {

    @Autowired
    private Medicinedao medicineDao;

    public ResponseEntity<ResponseStructure<medicine>> createMedicine(medicine medicine) {
        medicine savedMedicine = medicineDao.createMedicine(medicine);
        ResponseStructure<medicine> structure = new ResponseStructure<>(
                "Medicine saved successfully",
                HttpStatus.CREATED.value(),
                savedMedicine
        );
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }
    public ResponseEntity<ResponseStructure<medicine>> getAllMedicines() {
        ResponseStructure<List<medicine>> structure = new ResponseStructure<>();
        List<medicine> medicines = medicineDao.getAllMedicines();
        if(medicines.size()>0){
            structure.setMessage("Medicines retrieved successfully");
            structure.setData(medicines);
            structure.setStatuscode(HttpStatus.OK.value());
            return new ResponseEntity(structure, HttpStatus.OK);
        }
        throw new medicineException("No medicines found");

    }
    public ResponseEntity<ResponseStructure<Optional<medicine>>> getMedicineById(Long id) {
        Optional<medicine> recMedicine = medicineDao.getMedicineById(id);
        ResponseStructure<Optional<medicine>> structure = new ResponseStructure<>();
        if(recMedicine.isPresent()){
            structure.setMessage("Medicine retrieved successfully");
            structure.setData(recMedicine);
            structure.setStatuscode(HttpStatus.OK.value());
            return new ResponseEntity(structure, HttpStatus.OK);
        }
        throw new medicineException("Medicine not found");
    }
    public ResponseEntity<ResponseStructure<medicine>> updateMedicineById(medicine medicine, Long id) {

    Optional<medicine> recMedicine = medicineDao.getMedicineById(id);

    if (recMedicine.isPresent()) {

        medicine existMedicine = recMedicine.get();

        existMedicine.setName(medicine.getName());
        existMedicine.setCompany(medicine.getCompany());
        existMedicine.setExpiryDate(medicine.getExpiryDate());
        existMedicine.setQuantity(medicine.getQuantity());
        existMedicine.setPrice(medicine.getPrice());
        existMedicine.setDescription(medicine.getDescription());

        medicine updatedMedicine = medicineDao.createmedicine(existMedicine);

        ResponseStructure<medicine> structure = new ResponseStructure<>("Medicine updated successfully",HttpStatus.OK.value(),updatedMedicine);

        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    throw new medicineException("Medicine not found");
}
    public ResponseEntity<ResponseStructure<String>> deleteById(Long id){
        ResponseStructure<String> structure = new ResponseStructure<>();
        Optional<medicine> recMedicine = medicineDao.getMedicineById(id);
        if(recMedicine.isPresent()){
            medicineDao.deleteById(id);
            structure.setMessage("Medicin Deleted by id");
            structure.setData("Medicine deleted successfully");
            structure.setStatuscode(HttpStatus.NO_CONTENT.value());
            return new ResponseEntity<ResponseStructure<String>> (structure, HttpStatus.NO_CONTENT);
        }
        throw new medicineException("Medicine not found in this Id");
    }
    public ResponseEntity<ResponseStructure<List<medicine>>> searchMedicine(String name) {

    List<medicine> medicines = medicineDao.searchMedicine(name);

    ResponseStructure<List<medicine>> structure = new ResponseStructure<>();

    structure.setMessage("Search results");
    structure.setData(medicines);
    structure.setStatuscode(HttpStatus.OK.value());

    return new ResponseEntity<>(structure, HttpStatus.OK);
    }

}
