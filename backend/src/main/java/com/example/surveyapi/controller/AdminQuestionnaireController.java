package com.example.surveyapi.controller;

import com.example.surveyapi.dto.AdminQuestionnaireDto;
import com.example.surveyapi.service.AdminQuestionnaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/questionnaires")
public class AdminQuestionnaireController {

    private final AdminQuestionnaireService adminService;

    public AdminQuestionnaireController(AdminQuestionnaireService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<AdminQuestionnaireDto> list() {
        return adminService.listAll();
    }

    @GetMapping("/{id}")
    public AdminQuestionnaireDto one(@PathVariable("id")  Long id) {
        return adminService.getOne(id);
    }

    @PostMapping
    public AdminQuestionnaireDto create(@RequestBody  AdminQuestionnaireDto req) {
        return adminService.create(req);
    }

    @PutMapping("/{id}")
    public AdminQuestionnaireDto update(@PathVariable("id")  Long id, @RequestBody AdminQuestionnaireDto req) {
        return adminService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id")  Long id) {
        try {
            adminService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}