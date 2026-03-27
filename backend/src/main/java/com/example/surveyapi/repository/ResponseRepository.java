package com.example.surveyapi.repository;

import com.example.surveyapi.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Long> {

    List<Response> findByQuestionnaireIdOrderByIdDesc(Long questionnaireId);

}