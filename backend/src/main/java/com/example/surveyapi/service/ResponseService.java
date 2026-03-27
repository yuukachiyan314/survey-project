package com.example.surveyapi.service;

import com.example.surveyapi.dto.SubmitResponseRequest;
import com.example.surveyapi.entity.Answer;
import com.example.surveyapi.entity.Response;
import com.example.surveyapi.repository.AnswerRepository;
import com.example.surveyapi.repository.ResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final AnswerRepository answerRepository;

    public ResponseService(ResponseRepository responseRepository, AnswerRepository answerRepository) {
        this.responseRepository = responseRepository;
        this.answerRepository = answerRepository;
    }

    @Transactional
    public Long submit(Long questionnaireId, SubmitResponseRequest req) {

        // 1) responses：先存一筆，拿到 responseId
        Response r = new Response();
        r.setQuestionnaireId(questionnaireId);
        r.setRespondentName(req.respondentName);
        r.setSubmittedAt(req.submittedAt != null ? req.submittedAt : LocalDateTime.now());
        r = responseRepository.save(r);

        // 2) answers：整理成清單後一次存
        var list = new ArrayList<Answer>();

        if (req.answers != null) {
            for (SubmitResponseRequest.AnswerItem item : req.answers) {

                // text 題：存 answer_text
                if (item.text != null && !item.text.trim().isEmpty()) {
                    Answer a = new Answer();
                    a.setResponseId(r.getId());
                    a.setQuestionId(item.questionId);
                    a.setOptionId(null);
                    a.setAnswerText(item.text.trim());
                    list.add(a);
                }

                // single/multiple：optionIds 每個都存一筆（option_id）
                if (item.optionIds != null) {
                    for (Long optId : item.optionIds) {
                        Answer a = new Answer();
                        a.setResponseId(r.getId());
                        a.setQuestionId(item.questionId);
                        a.setOptionId(optId);
                        a.setAnswerText(null);
                        list.add(a);
                    }
                }
            }
        }

        answerRepository.saveAll(list);

        return r.getId();
    }
}