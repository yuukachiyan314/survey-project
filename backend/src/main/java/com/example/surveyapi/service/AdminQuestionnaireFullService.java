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
public class AdminQuestionnaireFullService {

    private final QuestionnaireRepository questionnaireRepo;
    private final QuestionRepository questionRepo;
    private final OptionRepository optionRepo;

    public AdminQuestionnaireFullService(
            QuestionnaireRepository questionnaireRepo,
            QuestionRepository questionRepo,
            OptionRepository optionRepo
    ) {
        this.questionnaireRepo = questionnaireRepo;
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
    }

    @Transactional
    public QuestionnaireFullDto createFull(QuestionnaireFullDto req) {
        // ---- 最小驗證
        if (req.title == null || req.title.trim().isEmpty()) {
            throw new IllegalArgumentException("title is required");
        }
        if (req.startTime == null || req.endTime == null) {
            throw new IllegalArgumentException("startTime/endTime is required");
        }
        if (req.questions == null || req.questions.isEmpty()) {
            throw new IllegalArgumentException("questions is required");
        }

        // 1) 建 questionnaire
        Questionnaire q = new Questionnaire();
        q.setTitle(req.title.trim());
        q.setDescription(req.description);
        q.setStartTime(req.startTime);
        q.setEndTime(req.endTime);
        // 你這支是 admin full create，預設先不發布也行；看你要不要從 req 帶
        q.setIsPublished(0);
        q.setCreatedAt(LocalDateTime.now());
        q.setViewCount(0);

        Questionnaire savedQ = questionnaireRepo.save(q);

        // 2) 建 questions + options
        List<Question> savedQuestions = new ArrayList<>();
        List<Option> allOptionsToSave = new ArrayList<>();

        for (QuestionDto qd : req.questions) {
            if (qd.title == null || qd.title.trim().isEmpty()) {
                throw new IllegalArgumentException("question title is required");
            }
            if (qd.questionType == null || qd.questionType.isBlank()) {
                throw new IllegalArgumentException("questionType is required");
            }

            Question question = new Question();
            question.setQuestionnaireId(savedQ.getId());
            question.setTitle(qd.title.trim());
            question.setQuestionType(qd.questionType); // 'single'/'multiple'/'text'
            question.setIsRequired(qd.isRequired == null ? 0 : qd.isRequired);
            question.setSortOrder(qd.sortOrder == null ? 0 : qd.sortOrder);
            question.setCreatedAt(LocalDateTime.now());

            Question savedQuestion = questionRepo.save(question);
            savedQuestions.add(savedQuestion);

            // text 題不存 options
            if (!"text".equalsIgnoreCase(qd.questionType)) {
                if (qd.options == null || qd.options.isEmpty()) {
                    throw new IllegalArgumentException("options required for non-text question");
                }
                for (OptionDto od : qd.options) {
                    if (od.optionText == null || od.optionText.trim().isEmpty()) {
                        throw new IllegalArgumentException("optionText is required");
                    }
                    Option opt = new Option();
                    opt.setQuestionId(savedQuestion.getId());
                    opt.setOptionText(od.optionText.trim());
                    opt.setSortOrder(od.sortOrder == null ? 0 : od.sortOrder);
                    allOptionsToSave.add(opt);
                }
            }
        }

        if (!allOptionsToSave.isEmpty()) optionRepo.saveAll(allOptionsToSave);

        // 3) 組回傳 dto（把 id 填回去）
        QuestionnaireFullDto out = new QuestionnaireFullDto();
        out.id = savedQ.getId();
        out.title = savedQ.getTitle();
        out.description = savedQ.getDescription();
        out.startTime = savedQ.getStartTime();
        out.endTime = savedQ.getEndTime();

        // 重新查 options（因為你沒有關聯）
        // 最省：每題查一次 optionsByQuestionId
        List<QuestionDto> outQuestions = new ArrayList<>();
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
            outQuestions.add(outQ);
        }
        out.questions = outQuestions;

        return out;
    }
}