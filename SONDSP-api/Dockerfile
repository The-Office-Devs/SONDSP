# Etapa 1: Build da aplicacao com Gradle e JDK 21
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuracao do Gradle e Wrapper
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Garante que o wrapper tenha permissao de execucao e quebra de linha Unix
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

# Baixa as dependencias em cache
RUN ./gradlew dependencies --no-daemon || true

# Copia o codigo fonte
COPY src src

# Executa o build gerando o JAR executavel (ignora os testes na etapa do build do container)
RUN ./gradlew bootJar --no-daemon -x test

# Etapa 2: Imagem leve de execucao (JRE 21)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Cria usuario nao-root por boas praticas de seguranca
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia o JAR gerado na etapa anterior
COPY --from=builder /app/build/libs/sondsp-*.jar app.jar

# Porta padrao (o Render define a variavel PORT dinamicamente)
EXPOSE 8081

# Ajustes de memoria para o plano gratuito do Render (limite de 512MB RAM)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
