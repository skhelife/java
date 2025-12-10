package com.studentgrade.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentgrade.entity.Permission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {

    @Select("SELECT p.* FROM permissions p " +
            "INNER JOIN role_permissions rp ON p.id = rp.permission_id " +
            "WHERE rp.role_id = #{roleId} AND rp.is_active = 1")
    List<Permission> findPermissionsByRoleId(@Param("roleId") Long roleId);
}
