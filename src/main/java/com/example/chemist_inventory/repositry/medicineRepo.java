package com.example.chemist_inventory.repositry;

import com.example.chemist_inventory.entity.medicine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface medicineRepo extends JpaRepository<medicine, Long> {
    List<medicine> findByNameContainingIgnoreCase(String name);
}
