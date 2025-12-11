package com.personalblog.controller;

import com.personalblog.domain.User;
import com.personalblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        String role = request.getOrDefault("role", User.Role.VISITOR.getValue());
        
        if (userService.findByUsername(username) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        
        User user = userService.createUser(username, password, email, role);
        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully",
            "userId", user.getId(),
            "username", user.getUsername()
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToMap(user));
    }
    
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToMap(user));
    }
    
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User user = userService.getById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update fields
        if (request.containsKey("nickname")) {
            user.setNickname((String) request.get("nickname"));
        }
        if (request.containsKey("avatar")) {
            user.setAvatar((String) request.get("avatar"));
        }
        if (request.containsKey("profileJson")) {
            // Can accept Map and convert to JSON string, or assume it's already a JSON string if passed as such
            // Since frontend passes a JSON object structure, we should probably serialize it to string here or accept a string.
            // But to simplify, let's assume frontend sends the JSON string or we convert it.
            // Actually, Spring will deserialize JSON to Map. So we should convert Map back to JSON string or just store it if we used a JSON type.
            // Since we used String in User entity, we need to store it as String.
            
            Object profileJsonObj = request.get("profileJson");
            if (profileJsonObj instanceof String) {
                user.setProfileJson((String) profileJsonObj);
            } else {
                // It's a Map/List, we need to serialize it. 
                // For simplicity, let's rely on frontend sending a stringified JSON for this field, 
                // OR we can use Jackson to serialize it back.
                try {
                     com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                     String jsonStr = mapper.writeValueAsString(profileJsonObj);
                     user.setProfileJson(jsonStr);
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.badRequest().body("Invalid profile JSON");
                }
            }
        }
        
        userService.updateById(user);
        
        return ResponseEntity.ok(convertToMap(user));
    }
    
    private Map<String, Object> convertToMap(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());
        response.put("avatar", user.getAvatar());
        response.put("role", user.getRole());
        response.put("profileJson", user.getProfileJson());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}
