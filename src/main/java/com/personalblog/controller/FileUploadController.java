package com.personalblog.controller;

import com.personalblog.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Received file upload request: " + file.getOriginalFilename() + ", size: " + file.getSize());
            String fileName = fileStorageService.storeFile(file);

            // Return relative path so frontend can use its proxy or absolute URL handling
            String fileDownloadUri = "/uploads/" + fileName;

            System.out.println("File stored successfully: " + fileName);
            return ResponseEntity.ok(Map.of(
                "fileName", fileName,
                "url", fileDownloadUri
            ));
        } catch (Exception e) {
            System.err.println("UPLOAD FAILED:");
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }
}
