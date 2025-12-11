package com.personalblog.controller;

import com.personalblog.domain.GalleryItem;
import com.personalblog.service.GalleryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {
    
    @Autowired
    private GalleryItemService galleryItemService;
    
    @GetMapping
    public ResponseEntity<?> getGalleryItems() {
        List<GalleryItem> items = galleryItemService.getGalleryItems();
        return ResponseEntity.ok(items);
    }
    
    @PostMapping
    public ResponseEntity<?> addGalleryItem(@RequestBody GalleryItem item) {
        item.setCreatedAt(LocalDateTime.now());
        galleryItemService.save(item);
        return ResponseEntity.ok(Map.of(
            "message", "Gallery item added successfully",
            "id", item.getId()
        ));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGalleryItem(@PathVariable Long id) {
        boolean removed = galleryItemService.removeById(id);
        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Gallery item deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
