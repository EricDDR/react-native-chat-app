import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

const API_URL_BASE = "http://192.168.0.103:8080/messages";

export default function App() {
  const [me, setMe] = useState("");

  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const listRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingList((v) => (messages.length ? v : true));
      const res = await fetch(API_URL_BASE, { method: "GET" });
      if (!res.ok) throw new Error(`GET falhou: ${res.status}`);

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await res.json() : [];
      const arr = Array.isArray(data) ? data : [];

      arr.sort((a, b) => {
        const ta = new Date(a?.timestamp ?? 0).getTime();
        const tb = new Date(b?.timestamp ?? 0).getTime();
        return ta - tb;
      });

      setMessages(arr);
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 100);
    } catch (err) {
      Alert.alert("Erro ao buscar mensagens", String(err?.message || err));
    } finally {
      setLoadingList(false);
    }
  }, [messages.length]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const id = setInterval(fetchMessages, 3000);
    return () => clearInterval(id);
  }, [fetchMessages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  }, [fetchMessages]);

  const validarEnvio = () => {
    if (!me.trim()) {
      Alert.alert("Validação", "Informe seu nome.");
      return false;
    }
    if (!text.trim()) {
      Alert.alert("Validação", "Digite uma mensagem.");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validarEnvio()) return;

    const payload = {
      sender: me.trim(),
      text: text.trim(),
    };

    try {
      setSubmitting(true);

      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        sender: payload.sender,
        text: payload.text,
        timestamp: new Date().toISOString(),
        __optimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      setText("");
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);

      const res = await fetch(API_URL_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`POST falhou: ${res.status} ${t}`);
      }

      await fetchMessages();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.__optimistic));
      Alert.alert("Erro ao enviar", String(err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const renderItem = ({ item }) => {
    const mine = item?.sender === me;
    return (
      <View style={[styles.row, mine ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
        <View style={[styles.bubble, mine ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.sender, mine ? styles.senderMe : styles.senderOther]}>
            {item?.sender ?? "Desconhecido"}
          </Text>
          <Text style={[styles.msgText, mine ? { color: "white" } : { color: "#0f172a" }]}>
            {item?.text ?? ""}
          </Text>
          <Text style={[styles.time, mine ? { color: "#e2e8f0" } : { color: "#64748b" }]}>
            {formatTime(item?.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Chat</Text>
    
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Seu nome</Text>
              <TextInput
                value={me}
                onChangeText={setMe}
                placeholder="nome"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

          </View>

          <View style={{ flex: 1, marginTop: 12 }}>
            {loadingList ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(it, idx) => String(it?.id ?? idx)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
              />
            )}
          </View>

          <View style={styles.composerWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Digite sua mensagem..."
              style={styles.composerInput}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={submitting}
              style={[styles.sendBtn, submitting && { opacity: 0.6 }]}
              accessibilityLabel="Enviar mensagem"
            >
              {submitting ? <ActivityIndicator /> : <Text style={styles.sendBtnText}>Enviar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "white", marginBottom: 4 },
  subtitle: { color: "#cbd5e1", fontSize: 12, marginBottom: 12 },

  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  field: { gap: 6 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 14, color: "#334155", fontWeight: "600" },
  input: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    borderRadius: 12,
    fontSize: 16,
    color: "#0f172a",
  },

  row: { width: "100%", marginBottom: 8, flexDirection: "row" },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  bubbleMe: { backgroundColor: "#4f46e5", alignSelf: "flex-end" },
  bubbleOther: { backgroundColor: "white", alignSelf: "flex-start" },
  sender: { fontSize: 11, fontWeight: "700" },
  senderMe: { color: "#c7d2fe" },
  senderOther: { color: "#334155" },
  msgText: { fontSize: 15 },
  time: { fontSize: 10, alignSelf: "flex-end" },

  composerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    fontSize: 16,
    color: "#0f172a",
  },
  sendBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { color: "white", fontSize: 14, fontWeight: "700" },
});