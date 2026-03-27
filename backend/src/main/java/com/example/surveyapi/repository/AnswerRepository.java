package com.example.surveyapi.repository;

import com.example.surveyapi.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByResponseIdIn(List<Long> responseIds);

}