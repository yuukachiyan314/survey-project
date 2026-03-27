package com.example.surveyapi.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.surveyapi.dto.*;
import com.example.surveyapi.entity.*;
import com.example.surveyapi.repository.*;

@Service
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepo;
    private final QuestionRepository questionRepo;
    private final OptionRepository optionRepo;

    public QuestionnaireService(
            QuestionnaireRepository questionnaireRepo,
            QuestionRepository questionRepo,
            OptionRepository optionRepo
    ) {
        this.questionnaireRepo = questionnaireRepo;
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
    }

    public QuestionnaireFullDto getFull(Long questionnaireId) {
        Questionnaire q = questionnaireRepo.findById(questionnaireId)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found: " + questionnaireId));

        List<Question> questions = questionRepo.findByQuestionnaireIdOrderBySortOrderAsc(questionnaireId);

        List<Long> questionIds = questions.stream().map(Question::getId).toList();

        final Map<Long, List<Option>> optionsByQid =
        	    questionIds.isEmpty()
        	        ? Map.of()
        	        : optionRepo.findByQuestionIdInOrderByQuestionIdAscSortOrderAsc(questionIds)
        	            .stream()
        	            .collect(Collectors.groupingBy(Option::getQuestionId));

        QuestionnaireFullDto dto = new QuestionnaireFullDto();
        dto.id = q.getId();
        dto.title = q.getTitle();
        dto.description = q.getDescription();
        dto.startTime = q.getStartTime();
        dto.endTime = q.getEndTime();

        dto.questions = questions.stream().map(qq -> {
            QuestionDto qdto = new QuestionDto();
            qdto.id = qq.getId();
            qdto.title = qq.getTitle();
            qdto.questionType = qq.getQuestionType();
            qdto.isRequired = qq.getIsRequired();
            qdto.sortOrder = qq.getSortOrder();

            List<Option> opts = optionsByQid.getOrDefault(qq.getId(), List.of());
            qdto.options = opts.stream().map(o -> {
                OptionDto odto = new OptionDto();
                odto.id = o.getId();
                odto.optionText = o.getOptionText();
                odto.sortOrder = o.getSortOrder();
                return odto;
            }).toList();

            return qdto;
        }).toList();

        return dto;
    }
}