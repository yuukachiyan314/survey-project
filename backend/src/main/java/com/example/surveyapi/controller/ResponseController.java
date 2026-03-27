package com.example.surveyapi.controller;

import com.example.surveyapi.dto.SubmitResponseRequest;
import com.example.surveyapi.dto.SubmitResponseResult;
import com.example.surveyapi.service.ResponseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questionnaires")
public class ResponseController {

    private final ResponseService responseService;

    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<SubmitResponseResult> submit(
            @PathVariable("id") Long questionnaireId,
            @RequestBody SubmitResponseRequest req
    ) {
        Long responseId = responseService.submit(questionnaireId, req);
        return ResponseEntity.ok(new SubmitResponseResult(responseId));
    }
}