package com.personalblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.personalblog.domain.Article;
import com.personalblog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    @GetMapping
    public ResponseEntity<?> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Article> articles = articleService.getPublishedArticles(page, size);
        return ResponseEntity.ok(Map.of(
            "articles", articles.getRecords(),
            "total", articles.getTotal(),
            "pages", articles.getPages(),
            "current", articles.getCurrent()
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        Article article = articleService.getPublishedArticle(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        
        articleService.incrementViewCount(id);
        return ResponseEntity.ok(article);
    }
    
    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody Article article) {
        Article created = articleService.createArticle(article);
        return ResponseEntity.ok(Map.of(
            "message", "Article created successfully",
            "id", created.getId()
        ));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        Article updated = articleService.updateArticle(article);
        return ResponseEntity.ok(Map.of(
            "message", "Article updated successfully",
            "id", updated.getId()
        ));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        boolean removed = articleService.removeById(id);
        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Article deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishArticle(@PathVariable Long id) {
        articleService.publishArticle(id);
        return ResponseEntity.ok(Map.of("message", "Article published successfully"));
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeArticle(@PathVariable Long id) {
        articleService.incrementLikeCount(id);
        return ResponseEntity.ok(Map.of("message", "Article liked successfully"));
    }
    
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Article> articles = articleService.page(new Page<>(page, size));
        return ResponseEntity.ok(Map.of(
            "articles", articles.getRecords(),
            "total", articles.getTotal(),
            "pages", articles.getPages(),
            "current", articles.getCurrent()
        ));
    }
}
