package br.com.sondsp.util;

import br.com.sondsp.entities.Survey;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class FileNameUtils {

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmm");

	private FileNameUtils() {}

	public static String formatActivityFileName(String activityName) {
		return sanitizeName(activityName);
	}

	public static String formatSurveyFileName(Survey survey) {
		String extension = extractExtension(survey.getSurveyImagePath());
		String sanitizedStudentName = sanitizeName(survey.getStudent().getName());
		LocalDateTime effectiveDate = (survey.getDate() != null) ? survey.getDate() : LocalDateTime.now();
		String formattedDate = effectiveDate.format(DATE_FORMATTER);

		return "sondagem_" + sanitizedStudentName + "_" + formattedDate + extension;
	}

	public static String sanitizeName(String text) {
		if (text == null || text.isBlank()) {
			return "arquivo";
		}

		String normalized = Normalizer
			.normalize(text, Normalizer.Form.NFD)
			.replaceAll("\\p{M}", "")
			.toLowerCase()
			.trim();

		String sanitized = normalized.replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
		return sanitized.isEmpty() ? "arquivo" : sanitized;
	}

	public static String extractExtension(String filename) {
		if (filename == null || !filename.contains(".")) {
			return "";
		}
		int lastDotIndex = filename.lastIndexOf(".");
		return filename.substring(lastDotIndex).toLowerCase();
	}
}
