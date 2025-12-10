package com.studentgrade.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentgrade.entity.Grade;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GradeMapper extends BaseMapper<Grade> {
}
