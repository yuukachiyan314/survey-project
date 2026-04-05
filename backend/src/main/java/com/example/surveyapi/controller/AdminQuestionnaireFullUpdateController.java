package com.example.surveyapi.controller;

import com.example.surveyapi.dto.QuestionnaireFullDto;
import com.example.surveyapi.service.AdminQuestionnaireFullUpdateService;
import com.example.surveyapi.vo.AppResponse;
import com.example.surveyapi.vo.RspCode;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/questionnaires")
public class AdminQuestionnaireFullUpdateController {

    private final AdminQuestionnaireFullUpdateService service;

    public AdminQuestionnaireFullUpdateController(AdminQuestionnaireFullUpdateService service) {
        this.service = service;
    }

    @GetMapping("/{id}/full")
    public QuestionnaireFullDto getFull(@PathVariable("id") Long id) {
        return service.getFull(id);
    }
    

    @PutMapping("/{id}/full")
    public AppResponse<QuestionnaireFullDto> updateFull(@PathVariable("id") Long id,
                                                        @RequestBody QuestionnaireFullDto req) {
        try {
            return AppResponse.success(service.updateFull(id, req));
        } catch (IllegalStateException e) {
            return AppResponse.error(RspCode.BAD_REQUEST, e.getMessage());
        } catch (IllegalArgumentException e) {
            return AppResponse.error(RspCode.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            return AppResponse.error(RspCode.ERROR, "server error");
        }
    }
}