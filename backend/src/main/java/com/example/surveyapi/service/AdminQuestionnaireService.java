package com.example.surveyapi.service;

import com.example.surveyapi.dto.AdminQuestionnaireDto;
import com.example.surveyapi.entity.Questionnaire;
import com.example.surveyapi.repository.QuestionnaireRepository;
import com.example.surveyapi.repository.ResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminQuestionnaireService {

    private final QuestionnaireRepository questionnaireRepo;
    private final ResponseRepository responseRepo;

    public AdminQuestionnaireService(QuestionnaireRepository questionnaireRepo,
                                     ResponseRepository responseRepo) {
        this.questionnaireRepo = questionnaireRepo;
        this.responseRepo = responseRepo;
    }

    @Transactional(readOnly = true)
    public List<AdminQuestionnaireDto> listAll() {
        return questionnaireRepo.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public AdminQuestionnaireDto getOne(Long id) {
        Questionnaire q = questionnaireRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found: " + id));
        return toDto(q);
    }

    @Transactional
    public AdminQuestionnaireDto create(AdminQuestionnaireDto req) {
        Questionnaire q = new Questionnaire();
        apply(q, req);

        if (q.getCreatedAt() == null) q.setCreatedAt(LocalDateTime.now());
        if (q.getViewCount() == null) q.setViewCount(0);
        if (q.getIsPublished() == null) q.setIsPublished(0);

        Questionnaire saved = questionnaireRepo.save(q);
        return toDto(saved);
    }

    @Transactional
    public AdminQuestionnaireDto update(Long id, AdminQuestionnaireDto req) {
        Questionnaire q = questionnaireRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found: " + id));

        apply(q, req);

        Questionnaire saved = questionnaireRepo.save(q);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        long cnt = responseRepo.countByQuestionnaireId(id);
        if (cnt > 0) {
            throw new IllegalStateException("This questionnaire has responses, cannot delete.");
        }
        questionnaireRepo.deleteById(id);
    }

    private void apply(Questionnaire q, AdminQuestionnaireDto req) {
        // 最小必填
        if (req.title == null || req.title.trim().isEmpty()) {
            throw new IllegalArgumentException("title is required");
        }
        q.setTitle(req.title.trim());
        q.setDescription(req.description);

        q.setIsPublished(req.isPublished == null ? 0 : req.isPublished);

        q.setStartTime(req.startTime);
        q.setEndTime(req.endTime);
    }

    private AdminQuestionnaireDto toDto(Questionnaire q) {
        AdminQuestionnaireDto dto = new AdminQuestionnaireDto();
        dto.id = q.getId();
        dto.title = q.getTitle();
        dto.description = q.getDescription();
        dto.isPublished = q.getIsPublished();
        dto.startTime = q.getStartTime();
        dto.endTime = q.getEndTime();
        dto.createdAt = q.getCreatedAt();
        dto.viewCount = q.getViewCount();
        return dto;
    }
}