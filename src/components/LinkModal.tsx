import { type FC, useEffect, useState } from "react";

import { Modal, StyleSheet, TextInput, View } from "react-native";

import { SPACES } from "@/constant";
import Button from "./Button";

interface LinkModalProps {
  isOpen: boolean;
  editedText: string;
  editedUrl: string;
  onClose: () => void;
  onSubmit: (text: string, url: string) => void;
}

export const LinkModal: FC<LinkModalProps> = ({
  isOpen,
  editedText,
  editedUrl,
  onClose,
  onSubmit,
}) => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setText(editedText);
    setUrl(editedUrl);
  }, [editedText, editedUrl]);

  const handleSave = () => {
    onSubmit(text, url);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.content}>
            <TextInput
              placeholder="Title"
              defaultValue={editedText}
              style={styles.input}
              onChangeText={setText}
            />
            <TextInput
              placeholder="Link"
              defaultValue={editedUrl}
              style={styles.input}
              onChangeText={setUrl}
            />
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                gap: SPACES.m,
                marginTop: SPACES.l,
              }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  isLight
                  disabled={false}
                  title="Cancel"
                  onPress={onClose}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="Save"
                  onPress={handleSave}
                  disabled={url.length === 0}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0, 0.5)",
  },
  modal: {
    width: 300,
    height: 240,
    backgroundColor: "white",
    borderRadius: 13,
    borderCurve: "continuous",
    paddingHorizontal: SPACES.l - 4,
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    width: "100%",
    marginVertical: 10,
  },
  saveButton: {
    width: "75%",
  },
});
