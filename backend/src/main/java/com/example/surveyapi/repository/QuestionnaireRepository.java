package com.example.surveyapi.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.surveyapi.entity.Questionnaire;

public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    List<Questionnaire> findByIsPublished(Integer isPublished);
}