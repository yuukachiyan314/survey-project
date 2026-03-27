package com.example.surveyapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.surveyapi.dto.QuestionnaireFullDto;
import com.example.surveyapi.entity.Questionnaire;
import com.example.surveyapi.repository.QuestionnaireRepository;
import com.example.surveyapi.service.QuestionnaireService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireRepository repo;
    private final QuestionnaireService questionnaireService;

    public QuestionnaireController(QuestionnaireRepository repo, QuestionnaireService questionnaireService) {
        this.repo = repo;
        this.questionnaireService = questionnaireService;
    }

    @GetMapping
    public List<Questionnaire> list() {
        return repo.findAll();
    }

    @GetMapping("/published")
    public List<Questionnaire> published() {
        return repo.findByIsPublished(1);
    }

    @GetMapping("/{id}/full")
    public QuestionnaireFullDto full(@PathVariable("id") Long id) {
        return questionnaireService.getFull(id);
    }
    }