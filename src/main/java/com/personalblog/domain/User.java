package com.personalblog.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_user")
public class User {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    private String username;
    private String password;
    private String email;
    private String nickname;
    private String avatar;
    
    // Stores the profile card JSON data (bio, slogan, stats, etc.)
    private String profileJson;
    
    private String role;
    private Boolean enabled;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum Role {
        VISITOR("visitor"),
        ADMIN("admin");
        
        private final String value;
        
        Role(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
