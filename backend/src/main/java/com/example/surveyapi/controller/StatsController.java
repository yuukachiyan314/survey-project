package com.example.surveyapi.controller;

import com.example.surveyapi.dto.QuestionnaireStatsDto;
import com.example.surveyapi.service.StatsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questionnaires")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/{id}/stats")
    public QuestionnaireStatsDto stats(@PathVariable("id") Long questionnaireId) {
        return statsService.getStats(questionnaireId);
    }
}