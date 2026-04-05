package com.example.surveyapi.service;

import com.example.surveyapi.dto.*;
import com.example.surveyapi.entity.*;
import com.example.surveyapi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminQuestionnaireFullUpdateService {

    private final QuestionnaireRepository questionnaireRepo;
    private final QuestionRepository questionRepo;
    private final OptionRepository optionRepo;
    private final ResponseRepository responseRepo;

    // ✅ 轉呼叫你前台已經寫好的 getFull(id)
    private final QuestionnaireService questionnaireService;

    public AdminQuestionnaireFullUpdateService(
            QuestionnaireRepository questionnaireRepo,
            QuestionRepository questionRepo,
            OptionRepository optionRepo,
            ResponseRepository responseRepo,
            QuestionnaireService questionnaireService
    ) {
        this.questionnaireRepo = questionnaireRepo;
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
        this.responseRepo = responseRepo;
        this.questionnaireService = questionnaireService;
    }

    // ✅ 新增：給後台 /questions 讀回整包（含題目）
    @Transactional(readOnly = true)
    public QuestionnaireFullDto getFull(Long id) {
        return questionnaireService.getFull(id);
    }

    @Transactional
    public QuestionnaireFullDto updateFull(Long id, QuestionnaireFullDto req) {
        // 1) 回覆保護：有回覆就不准改題目
        long cnt = responseRepo.countByQuestionnaireId(id);
        if (cnt > 0) {
            throw new IllegalStateException("This questionnaire has responses, cannot update questions/options.");
        }

        // 2) 找 questionnaire
        Questionnaire q = questionnaireRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found: " + id));

        // 3) 基本驗證
        if (req.title == null || req.title.trim().isEmpty()) {
            throw new IllegalArgumentException("title is required");
        }
        if (req.startTime == null || req.endTime == null) {
            throw new IllegalArgumentException("startTime/endTime is required");
        }
        if (req.questions == null || req.questions.isEmpty()) {
            throw new IllegalArgumentException("questions is required");
        }

        // 4) 更新 questionnaire 基本資料（不動 isPublished）
        q.setTitle(req.title.trim());
        q.setDescription(req.description);
        q.setStartTime(req.startTime);
        q.setEndTime(req.endTime);
        questionnaireRepo.save(q);

        // 5) 刪舊 questions/options（先 options 再 questions）
        List<Question> oldQs = questionRepo.findByQuestionnaireIdOrderBySortOrderAsc(id);
        List<Long> oldQids = oldQs.stream().map(Question::getId).toList();

        if (!oldQids.isEmpty()) {
            optionRepo.deleteByQuestionIdIn(oldQids);
        }
        questionRepo.deleteByQuestionnaireId(id);

        // 6) 依 req 重建 questions/options
        List<Question> savedQuestions = new ArrayList<>();
        List<Option> allOptionsToSave = new ArrayList<>();

        for (QuestionDto qd : req.questions) {
            if (qd.title == null || qd.title.trim().isEmpty()) {
                throw new IllegalArgumentException("question title is required");
            }
            if (qd.questionType == null || qd.questionType.isBlank()) {
                throw new IllegalArgumentException("questionType is required");
            }

            Question nq = new Question();
            nq.setQuestionnaireId(id);
            nq.setTitle(qd.title.trim());
            nq.setQuestionType(qd.questionType); // single/multiple/text
            nq.setIsRequired(qd.isRequired == null ? 0 : qd.isRequired);
            nq.setSortOrder(qd.sortOrder == null ? 0 : qd.sortOrder);
            nq.setCreatedAt(LocalDateTime.now());

            Question savedQ = questionRepo.save(nq);
            savedQuestions.add(savedQ);

            if (!"text".equalsIgnoreCase(qd.questionType)) {
                if (qd.options == null || qd.options.isEmpty()) {
                    throw new IllegalArgumentException("options required for non-text question");
                }
                for (OptionDto od : qd.options) {
                    if (od.optionText == null || od.optionText.trim().isEmpty()) {
                        throw new IllegalArgumentException("optionText is required");
                    }
                    Option opt = new Option();
                    opt.setQuestionId(savedQ.getId());
                    opt.setOptionText(od.optionText.trim());
                    opt.setSortOrder(od.sortOrder == null ? 0 : od.sortOrder);
                    allOptionsToSave.add(opt);
                }
            }
        }

        if (!allOptionsToSave.isEmpty()) {
            optionRepo.saveAll(allOptionsToSave);
        }

        // 7) 回傳最新 full（重新查 options）
        QuestionnaireFullDto out = new QuestionnaireFullDto();
        out.id = q.getId();
        out.title = q.getTitle();
        out.description = q.getDescription();
        out.startTime = q.getStartTime();
        out.endTime = q.getEndTime();

        List<QuestionDto> outQs = new ArrayList<>();
        for (Question sq : savedQuestions) {
            QuestionDto outQ = new QuestionDto();
            outQ.id = sq.getId();
            outQ.title = sq.getTitle();
            outQ.questionType = (sq.getQuestionType() == null ? null : sq.getQuestionType().toLowerCase());
            outQ.isRequired = sq.getIsRequired();
            outQ.sortOrder = sq.getSortOrder();
            outQ.options = new ArrayList<>();

            if (!"text".equalsIgnoreCase(sq.getQuestionType())) {
                List<Option> opts = optionRepo.findByQuestionIdOrderBySortOrderAsc(sq.getId());
                for (Option o : opts) {
                    OptionDto od = new OptionDto();
                    od.id = o.getId();
                    od.optionText = o.getOptionText();
                    od.sortOrder = o.getSortOrder();
                    outQ.options.add(od);
                }
            }
            outQs.add(outQ);
        }
        out.questions = outQs;

        return out;
    }
}