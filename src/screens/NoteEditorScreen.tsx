import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeHtmlEvent,
  OnChangeSelectionEvent,
  OnChangeStateEvent,
  OnChangeTextEvent,
  OnLinkDetected,
} from "react-native-enriched";
import { ArrowLeftIcon, Check } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppStackParamList } from "@/types/navigation";
import {
  useCreateNote,
  useGetNoteById,
  useUpdateNote,
} from "@/api/notes.queries";
import { COLORS, SPACES } from "@/constant";
import { LinkModal } from "@/components/LinkModal";
import { Toolbar } from "@/components/Toolbar";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "NoteEditor"
>;
type RouteProps = RouteProp<AppStackParamList, "NoteEditor">;

interface Selection {
  start: number;
  end: number;
  text: string;
}

type StylesState = OnChangeStateEvent;
type CurrentLinkState = OnLinkDetected;

const DEFAULT_STYLE: StylesState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikeThrough: false,
  isInlineCode: false,
  isH1: false,
  isH2: false,
  isH3: false,
  isBlockQuote: false,
  isCodeBlock: false,
  isOrderedList: false,
  isUnorderedList: false,
  isLink: false,
  isImage: false,
  isMention: false,
};

const DEFAULT_LINK_STATE = {
  text: "",
  url: "",
  start: 0,
  end: 0,
};

const ANDROID_EXPERIMENTAL_SYNCHRONOUS_EVENTS = false;

export function NoteEditorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const contentRef = useRef<EnrichedTextInputInstance>(null);
  const { noteId, title: initialTitle } = route.params || {};
  const isEditing = !!noteId;

  const { data: note } = useGetNoteById(noteId || "");
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();

  const [title, setTitle] = useState(initialTitle || "");
  const [stylesState, setStylesState] = useState<StylesState>(DEFAULT_STYLE);
  const [currentLink, setCurrentLink] =
    useState<CurrentLinkState>(DEFAULT_LINK_STATE);
  const [currentHtml, setCurrentHtml] = useState<string | null>("");
  const [selection, setSelection] = useState<Selection>();
  const [error, setError] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Hydrate form if editing
  useEffect(() => {
    if (isEditing && note) {
      if (note) {
        setTitle(note.title);
        setCurrentHtml(note.content || "");

        console.log(note.content);
      } else {
        // Handle case where note is not found (unlikely but possible)
        Alert.alert("Error", "Note not found");
        navigation.goBack();
      }
    }
  }, [isEditing, noteId, note, navigation, initialTitle]);

  const isLoading =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  const handleChangeText = (e: OnChangeTextEvent) => {
    console.log("Text changed:", e.value);
  };

  const handleChangeHtml = (e: OnChangeHtmlEvent) => {
    console.log("HTML changed:", e.value);
    setCurrentHtml(e.value);
  };

  const handleChangeState = (state: OnChangeStateEvent) => {
    setStylesState(state);
  };

  const handleSelectionChangeEvent = (sel: OnChangeSelectionEvent) => {
    setSelection(sel);
  };

  const handleLinkDetected = (state: CurrentLinkState) => {
    console.log(state);
    setCurrentLink(state);
  };

  const openLinkModal = () => {
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const insideCurrentLink =
    stylesState.isLink &&
    currentLink.url.length > 0 &&
    (currentLink.start || currentLink.end) &&
    selection &&
    selection.start >= currentLink.start &&
    selection.end <= currentLink.end;

  const submitLink = (text: string, url: string) => {
    if (!selection || url.length === 0) {
      closeLinkModal();
      return;
    }

    const newText = text.length > 0 ? text : url;

    if (insideCurrentLink) {
      contentRef.current?.setLink(
        currentLink.start,
        currentLink.end,
        newText,
        url
      );
    } else {
      contentRef.current?.setLink(selection.start, selection.end, newText, url);
    }

    closeLinkModal();
  };

  const handleSave = () => {
    if (!title.trim() || !currentHtml?.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError(null);

    if (isEditing && noteId) {
      updateNoteMutation.mutate(
        {
          id: noteId,
          data: { title: title.trim(), content: currentHtml?.trim() },
        },
        {
          onSuccess: () => navigation.goBack(),
          onError: (err) => setError(err.message),
        }
      );
    } else {
      createNoteMutation.mutate(
        { title: title.trim(), content: currentHtml?.trim() },
        {
          onSuccess: () => navigation.goBack(),
          onError: (err) => setError(err.message),
        }
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <View>
            <ArrowLeftIcon size={24} color={COLORS.black} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Note" : "New Note"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={[styles.saveButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Check size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <View style={styles.editorContainer}>
            <EnrichedTextInput
              ref={contentRef}
              defaultValue={note?.content}
              cursorColor="dodgerblue"
              autoCapitalize="sentences"
              onChangeText={(e) => handleChangeText(e.nativeEvent)}
              onChangeHtml={(e) => handleChangeHtml(e.nativeEvent)}
              onChangeState={(e) => handleChangeState(e.nativeEvent)}
              onChangeSelection={(e) =>
                handleSelectionChangeEvent(e.nativeEvent)
              }
              placeholder=" Start typing..."
              placeholderTextColor="#999"
              style={styles.editor}
              androidExperimentalSynchronousEvents={
                ANDROID_EXPERIMENTAL_SYNCHRONOUS_EVENTS
              }
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* <Button
            title={stylesState?.isBold ? 'Unbold' : 'Bold'}
            color={stylesState?.isBold ? 'green' : 'gray'}
            onPress={() => ref.current?.toggleBold()}
          /> */}
        </ScrollView>
        <Toolbar
          stylesState={stylesState}
          editorRef={contentRef}
          onOpenLinkModal={openLinkModal}

          // onSelectImage={openImageModal}
        />
        <LinkModal
          isOpen={isLinkModalOpen}
          editedText={
            insideCurrentLink ? currentLink.text : selection?.text ?? ""
          }
          editedUrl={insideCurrentLink ? currentLink.url : ""}
          onSubmit={submitLink}
          onClose={closeLinkModal}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACES.l,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  saveButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACES.l,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.black,
  },
  editorContainer: {
    flex: 1,
    minHeight: 200,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
