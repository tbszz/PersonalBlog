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
@RequestMapping("/gallery")
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
}
