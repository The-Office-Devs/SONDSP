package br.com.sondsp.services;

import br.com.sondsp.exceptions.GenericImageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadImage(MultipartFile arquivo) throws IOException {
        String fileName = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.valueOf(arquivo.getContentType()));

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(arquivo.getBytes(), headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return fileName;
        } else {
            throw new RuntimeException("Erro ao fazer upload da imagem privada para o Supabase.");
        }
    }

    public String generateSignedUrl(String filePath, int expiresIn) {
        if (filePath == null || filePath.isBlank()) {
            return null;
        }

        String url = supabaseUrl + "/storage/v1/object/sign/" + bucketName + "/" + filePath;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Integer> body = Map.of("expiresIn", expiresIn);
        HttpEntity<Map<String, Integer>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String signedUrl = (String) response.getBody().get("signedURL");
                if (signedUrl != null && !signedUrl.startsWith("http")) {
                    signedUrl = supabaseUrl + "/storage/v1" + signedUrl;
                }
                return signedUrl;
            }
        } catch (Exception e) {
            throw new GenericImageException();
        }
        return null;
    }
}
