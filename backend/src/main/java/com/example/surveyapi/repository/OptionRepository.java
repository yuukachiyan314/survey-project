package com.example.surveyapi.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.surveyapi.entity.Option;

public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestionIdInOrderByQuestionIdAscSortOrderAsc(List<Long> questionIds);
}