package com.studentgrade.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentgrade.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface RoleMapper extends BaseMapper<Role> {

    @Select("SELECT r.* FROM roles r " +
            "INNER JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND ur.is_active = 1 AND r.status = 'ACTIVE'")
    List<Role> findRolesByUserId(@Param("userId") Long userId);
}
