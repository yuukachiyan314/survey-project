package com.example.surveyapi.controller;

import com.example.surveyapi.dto.QuestionnaireFullDto;
import com.example.surveyapi.service.AdminQuestionnaireFullService;
import com.example.surveyapi.vo.AppResponse;
import com.example.surveyapi.vo.RspCode;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/questionnaires")
public class AdminQuestionnaireFullController {

    private final AdminQuestionnaireFullService fullService;

    public AdminQuestionnaireFullController(AdminQuestionnaireFullService fullService) {
        this.fullService = fullService;
    }

    @PostMapping("/full")
    public AppResponse<QuestionnaireFullDto> createFull(@RequestBody QuestionnaireFullDto req) {
        try {
            return AppResponse.success(fullService.createFull(req));
        } catch (IllegalArgumentException e) {
            return AppResponse.error(RspCode.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            return AppResponse.error(RspCode.ERROR, "server error");
        }
    }
}